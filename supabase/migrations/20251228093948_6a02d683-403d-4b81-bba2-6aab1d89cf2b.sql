-- Create learning_materials table for notes, books, timetables
CREATE TABLE public.learning_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('notes', 'book', 'timetable', 'activity', 'other')),
  subject TEXT,
  grade TEXT,
  week TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  total_marks INTEGER DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  marks INTEGER DEFAULT 1,
  order_num INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_submissions table
CREATE TABLE public.quiz_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER,
  total_marks INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(quiz_id, user_id)
);

-- Create marks table for learner results
CREATE TABLE public.marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('test', 'exam', 'assignment', 'project', 'quiz')),
  assessment_name TEXT NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  total_marks DECIMAL(5,2) NOT NULL,
  term TEXT,
  year INTEGER,
  feedback TEXT,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'event', 'exam')),
  target_audience TEXT[] DEFAULT ARRAY['all'],
  target_grades TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create events/calendar table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('exam', 'holiday', 'meeting', 'sports', 'cultural', 'other')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  target_grades TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_logs table
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipients TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Learning Materials Policies
CREATE POLICY "Authenticated users can view materials" ON public.learning_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers/Admin can insert materials" ON public.learning_materials FOR INSERT TO authenticated WITH CHECK (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);
CREATE POLICY "Teachers/Admin can update materials" ON public.learning_materials FOR UPDATE TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);
CREATE POLICY "Teachers/Admin can delete materials" ON public.learning_materials FOR DELETE TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Quizzes Policies
CREATE POLICY "Authenticated users can view published quizzes" ON public.quizzes FOR SELECT TO authenticated USING (status = 'published' OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Teachers/Admin can manage quizzes" ON public.quizzes FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Quiz Questions Policies
CREATE POLICY "Authenticated users can view quiz questions" ON public.quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Teachers/Admin can manage quiz questions" ON public.quiz_questions FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Quiz Submissions Policies
CREATE POLICY "Users can view their own submissions" ON public.quiz_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own submissions" ON public.quiz_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Marks Policies
CREATE POLICY "Learners can view their own marks" ON public.marks FOR SELECT TO authenticated USING (
  auth.uid() = learner_id OR has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);
CREATE POLICY "Teachers/Admin can manage marks" ON public.marks FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Announcements Policies
CREATE POLICY "Authenticated users can view announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Teachers can manage announcements" ON public.announcements FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Events Policies
CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Teachers can manage events" ON public.events FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'grade_head'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Email Logs Policies
CREATE POLICY "Admins can view all email logs" ON public.email_logs FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = sender_id
);
CREATE POLICY "Admin/Teachers can send emails" ON public.email_logs FOR INSERT TO authenticated WITH CHECK (
  has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'principal'::app_role)
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies for uploads bucket
CREATE POLICY "Authenticated users can view uploads" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "Teachers/Admin can upload files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'uploads' AND (
    has_role(auth.uid(), 'teacher'::app_role) OR 
    has_role(auth.uid(), 'grade_head'::app_role) OR 
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'principal'::app_role)
  )
);
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);

-- Storage policies for payment proofs bucket
CREATE POLICY "Users can upload payment proofs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-proofs');
CREATE POLICY "Admins can view payment proofs" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create storage bucket for registration documents
INSERT INTO storage.buckets (id, name, public) VALUES ('registration-docs', 'registration-docs', false);

-- Storage policies for registration docs
CREATE POLICY "Users can upload registration docs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'registration-docs');
CREATE POLICY "Admins can view registration docs" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'registration-docs' AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add triggers for updated_at
CREATE TRIGGER update_learning_materials_updated_at BEFORE UPDATE ON public.learning_materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON public.marks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();