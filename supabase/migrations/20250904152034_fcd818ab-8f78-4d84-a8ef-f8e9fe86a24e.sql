-- Create storage buckets for user files
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('user-code-files', 'user-code-files', false),
  ('user-projects', 'user-projects', false);

-- Create policies for user code files bucket
CREATE POLICY "Users can view their own code files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own code files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own code files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own code files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-code-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for user projects bucket
CREATE POLICY "Users can view their own projects" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own projects" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own projects" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-projects' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own projects" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add a projects table for better organization
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'python',
  is_public BOOLEAN NOT NULL DEFAULT false,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();