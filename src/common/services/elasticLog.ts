import { getCookie } from 'cookies-next';

export interface ProfilePageViewLogData {
  profile_slug: string | null;
  activity_type: string;
  timestamp: string;
  terminal_id?: string | null;
  location: string | null;
  page_url: string | null;
  user_id: string | null;
}

export const sendProfilePageViewLog = async (data: ProfilePageViewLogData): Promise<void> => {
  console.log('🚀 Sending profile page view log via API route:', data);
  
  try {
    const response = await fetch('https://apigw.paziresh24.com/prof/v1/pageview', {
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
  // Get current time in Tehran timezone
  const tehranTime = new Date().toLocaleString('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(', ', 'T') + '+03:30';

  return {
    profile_slug: profileSlug && profileSlug.trim() ? profileSlug : null,
    activity_type: 'profile-page-view',
    timestamp: tehranTime,
    terminal_id: getCookie('terminal_id') as string | null,
    location: location || null,
    page_url: typeof window !== 'undefined' ? window.location.href : null,
    user_id: userInfo?.id || null,
  };
};
