import axios from 'axios';

export async function fetchHtml(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });
    return data;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
    throw new Error('Failed to fetch HTML.');
  }
}
