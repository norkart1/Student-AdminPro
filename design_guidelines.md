# Student Administrative App - Design Guidelines

## Brand Identity

**Purpose**: Administrative tool for managing student records and data. Used by students (view-only) and administrators (full management).

**Aesthetic Direction**: Professional & trustworthy - clean interface with clear hierarchy, institutional reliability, efficient workflows. Think educational SaaS platform, not consumer social app.

**Memorable Element**: Distinctive deep blue primary color paired with warm amber accents for important actions, creating a balance between authority and approachability.

## Navigation Architecture

**Auth Flow**: Required (separate student and admin authentication)

**Root Navigation**: 
- **Students**: Stack-only (minimal features - view grades, profile)
- **Admins**: Drawer navigation (access to multiple management sections)

**Screen List**:
1. Landing Page - Welcome screen with role selection
2. Student Login - Student authentication
3. Admin Login - Admin authentication (separate URL path)
4. Student Dashboard - View personal information, grades
5. Admin Dashboard - Overview statistics, quick actions
6. Student Management - Admin CRUD for student records
7. Settings - Admin configuration

## Screen Specifications

### Landing Page
- **Purpose**: Role selection gateway
- **Layout**: Full-screen centered content, no header
- **Components**: 
  - App logo/title at top third
  - Two large card buttons: "Student Login" and "Admin Portal"
  - Insets: top: insets.top + 80, bottom: insets.bottom + 40
- **Empty State**: N/A

### Student Login
- **Purpose**: Student authentication
- **Layout**: Scrollable form, default header with back button
- **Components**:
  - Username/ID input field
  - Password input field
  - "Login" button (full-width, primary color)
  - "Forgot password?" link below
- **Insets**: top: headerHeight + 40, bottom: insets.bottom + 40

### Admin Login
- **Purpose**: Administrator authentication
- **Layout**: Scrollable form, default header with back button
- **Components**:
  - Username field (pre-filled hint: "admin")
  - Password field (secure entry)
  - "Sign In" button (full-width, primary color)
  - Small text: "Admin access only"
- **Insets**: top: headerHeight + 40, bottom: insets.bottom + 40

### Student Dashboard
- **Purpose**: Students view their information
- **Layout**: Scrollable, default header with logout button (right)
- **Components**:
  - Profile header (avatar, name, student ID)
  - Card sections: "My Grades", "Personal Information", "Announcements"
- **Insets**: top: headerHeight + 24, bottom: insets.bottom + 24

### Admin Dashboard
- **Purpose**: Overview and quick access to admin functions
- **Layout**: Scrollable, custom header with drawer toggle (left)
- **Components**:
  - Welcome header with admin name
  - Statistics cards (total students, new enrollments, pending actions)
  - Quick action buttons: "Add Student", "View Reports"
  - Recent activity list
- **Insets**: top: headerHeight + 24, bottom: insets.bottom + 24
- **Empty State**: empty-students.png when no students exist

### Student Management (Admin)
- **Purpose**: CRUD operations for student records
- **Layout**: List view, custom header with search bar, drawer toggle (left), add button (right)
- **Components**:
  - Search bar in header
  - Student list (cards with name, ID, status)
  - Floating action button: "Add Student" (bottom right, with shadow)
- **Insets**: top: headerHeight + 16, bottom: insets.bottom + 90
- **Empty State**: empty-students.png
- **Shadow for FAB**: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2

## Color Palette

- **Primary**: #1E3A8A (deep institutional blue)
- **Primary Light**: #3B82F6 (for hover states)
- **Accent**: #F59E0B (amber - for important actions)
- **Background**: #F8FAFC (cool light gray)
- **Surface**: #FFFFFF
- **Border**: #E2E8F0
- **Text Primary**: #1E293B
- **Text Secondary**: #64748B
- **Success**: #10B981
- **Error**: #EF4444
- **Warning**: #F59E0B

## Typography

**Font**: System default (SF Pro for iOS, Roboto for Android)

**Type Scale**:
- **H1**: 32px, Bold (page titles)
- **H2**: 24px, Semibold (section headers)
- **H3**: 18px, Semibold (card titles)
- **Body**: 16px, Regular (main content)
- **Caption**: 14px, Regular (secondary info)
- **Button**: 16px, Semibold

## Visual Design

- Cards have subtle border (1px, Border color), no shadow
- Primary buttons: filled with Primary color, white text
- Secondary buttons: outlined with Primary color, Primary text
- All touchable elements scale to 0.96 when pressed
- Input fields: 1px border (Border color), rounded corners (8px), focus state changes border to Primary
- Icons: Feather icons, 24px for primary actions, 20px for secondary

## Assets to Generate

1. **icon.png** - App icon featuring graduation cap or academic symbol in Primary blue
   - WHERE USED: Device home screen

2. **splash-icon.png** - Simple version of app icon for launch screen
   - WHERE USED: App launch splash

3. **empty-students.png** - Illustration of empty classroom or desk with "No students yet" feel
   - WHERE USED: Admin Student Management screen when list is empty

4. **welcome-illustration.png** - Friendly illustration of students/education theme
   - WHERE USED: Landing page, above role selection buttons

5. **admin-avatar.png** - Default avatar for admin profile
   - WHERE USED: Admin dashboard, drawer header

6. **student-avatar.png** - Default avatar for student profiles (generate 3 variations)
   - WHERE USED: Student dashboard, student list items