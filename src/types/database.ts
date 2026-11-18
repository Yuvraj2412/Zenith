export type UserRole = "user" | "admin";

export type PaymentStatus = "pending" | "success" | "rejected";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string;
  college: string;
  student_id: string;
  age: number | null;
  gender: string;
  city: string;
  state: string;
  aadhar_last4: string;
  role: UserRole;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Registration = {
  id: string;
  user_id: string;
  sport_slug: string;
  sport_name: string;
  category_id: string;
  category_label: string;
  team_name: string;
  squad_count: number;
  player_names: string;
  amount_inr: number;
  utr_number: string;
  payment_screenshot_path: string;
  payment_status: PaymentStatus;
  admin_note: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RegistrationWithSignedUrl = Registration & {
  screenshot_url: string | null;
};

export type AdminRegistrationRecord = RegistrationWithSignedUrl & {
  profile: Pick<
    Profile,
    | "id"
    | "email"
    | "full_name"
    | "phone"
    | "college"
    | "student_id"
    | "age"
    | "gender"
    | "city"
    | "state"
    | "aadhar_last4"
  > | null;
};
