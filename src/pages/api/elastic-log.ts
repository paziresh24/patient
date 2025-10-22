import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { profile_slug, activity_type, timestamp, terminal_id, location, page_url, user_id } = req.body;

    const logData = {
      profile_slug,
      activity_type,
      timestamp,
      terminal_id,
      location,
      page_url,
      user_id,
    };

    console.log('🚀 Server-side sending elastic log:', logData);

    const response = await fetch('https://datastore.darkube.app/profile_page_view/_doc/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'ApiKey T1FCbERKb0J1TXUzU2oyOVBEX1M6c01xWENkZFFSZnlWSzN3Y2RMS0Fndw==',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to send elastic log:', response.status, response.statusText, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to send elastic log', 
        details: errorText 
      });
    }

    const responseData = await response.text();
    console.log('✅ Elastic log sent successfully:', responseData);

    return res.status(200).json({ 
      success: true, 
      message: 'Elastic log sent successfully',
      elasticResponse: responseData 
    });

  } catch (error) {
    console.error('❌ Error sending elastic log:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

