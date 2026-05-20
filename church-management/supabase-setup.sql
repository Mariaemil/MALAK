-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('manager', 'teacher')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create classes table
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  day_of_week text not null check (day_of_week in ('friday', 'thursday', 'sunday')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create class_teachers junction table
create table if not exists public.class_teachers (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(class_id, teacher_id)
);

-- Create students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  class_id uuid not null references public.classes(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create attendance_records table
create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  record_date date not null,
  attended_shamosya boolean default false,
  attended_mass boolean default false,
  home_visit boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, record_date)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_teachers enable row level security;
alter table public.students enable row level security;
alter table public.attendance_records enable row level security;

-- RLS Policies for profiles
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Managers can read all profiles"
  on public.profiles for select
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

-- RLS Policies for classes
create policy "Authenticated users can read classes"
  on public.classes for select
  using (auth.role() = 'authenticated');

create policy "Managers can create classes"
  on public.classes for insert
  with check (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can update classes"
  on public.classes for update
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can delete classes"
  on public.classes for delete
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

-- RLS Policies for class_teachers
create policy "Authenticated users can read class_teachers"
  on public.class_teachers for select
  using (auth.role() = 'authenticated');

create policy "Managers can insert class_teachers"
  on public.class_teachers for insert
  with check (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can delete class_teachers"
  on public.class_teachers for delete
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

-- RLS Policies for students
create policy "Teachers can read students in their class"
  on public.students for select
  using (
    class_id in (
      select class_id from public.class_teachers where teacher_id = auth.uid()
    ) or
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can read all students"
  on public.students for select
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can insert students"
  on public.students for insert
  with check (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can update students"
  on public.students for update
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Managers can delete students"
  on public.students for delete
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

-- RLS Policies for attendance_records
create policy "Teachers can read attendance for their class"
  on public.attendance_records for select
  using (
    class_id in (
      select class_id from public.class_teachers where teacher_id = auth.uid()
    ) or
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

create policy "Teachers can insert attendance for their class"
  on public.attendance_records for insert
  with check (
    class_id in (
      select class_id from public.class_teachers where teacher_id = auth.uid()
    )
  );

create policy "Teachers can update attendance for their class"
  on public.attendance_records for update
  using (
    class_id in (
      select class_id from public.class_teachers where teacher_id = auth.uid()
    )
  );

create policy "Managers can read all attendance"
  on public.attendance_records for select
  using (
    auth.uid() in (
      select id from public.profiles where role = 'manager'
    )
  );

-- Create indexes for better performance
create index if not exists idx_class_teachers_teacher_id on public.class_teachers(teacher_id);
create index if not exists idx_class_teachers_class_id on public.class_teachers(class_id);
create index if not exists idx_students_class_id on public.students(class_id);
create index if not exists idx_attendance_student_id on public.attendance_records(student_id);
create index if not exists idx_attendance_class_id on public.attendance_records(class_id);
create index if not exists idx_attendance_teacher_id on public.attendance_records(teacher_id);
create index if not exists idx_attendance_record_date on public.attendance_records(record_date);
