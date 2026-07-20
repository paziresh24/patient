let profileDoctorUserId: string | null = null;
let profileWidgetName: string | null = null;

export function setProfileDoctorUserId(id: string | null) {
  profileDoctorUserId = id;
}

export function getProfileDoctorUserId(): string | null {
  return profileDoctorUserId;
}

export function setProfileWidgetName(name: string | null) {
  profileWidgetName = name;
}

export function getProfileWidgetName(): string | null {
  return profileWidgetName;
}
