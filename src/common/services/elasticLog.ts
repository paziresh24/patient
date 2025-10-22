import { getCookie } from 'cookies-next';

export interface ProfilePageViewLogData {
  profile_slug: string | null;
  activity_type: string;
  timestamp: string;
  terminal_id: string | null;
  location: string | null;
  page_url: string | null;
  user_id: string | null;
}

export const sendProfilePageViewLog = async (data: ProfilePageViewLogData): Promise<void> => {
  console.log('🚀 Sending profile page view log via API route:', data);
  
  try {
    const response = await fetch('/api/elastic-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('❌ Failed to send profile page view log:', response.status, response.statusText);
      const errorData = await response.json();
      console.error('❌ Error details:', errorData);
    } else {
      console.log('✅ Profile page view log sent successfully');
      const responseData = await response.json();
      console.log('📊 API response:', responseData);
    }
  } catch (error) {
    console.error('❌ Error sending profile page view log:', error);
  }
};

export const createProfilePageViewLogData = (
  profileSlug: string,
  userInfo?: any,
  location?: string
): ProfilePageViewLogData => {
  return {
    profile_slug: profileSlug && profileSlug.trim() ? profileSlug : null,
    activity_type: 'profile-page-view',
    timestamp: new Date().toISOString(),
    terminal_id: getCookie('terminal_id') || null,
    location: location || null,
    page_url: typeof window !== 'undefined' ? window.location.href : null,
    user_id: userInfo?.id || null,
  };
};
