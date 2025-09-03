export const safeJsonParse = async (response: Response) => {
  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    // If JSON parsing fails, check if it's HTML
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('서버가 HTML 페이지를 반환했습니다. API 엔드포인트를 확인해주세요.');
    }
    
    // If it's not HTML, it might be plain text error
    if (text.trim()) {
      throw new Error(`서버 응답을 파싱할 수 없습니다: ${text.substring(0, 100)}...`);
    }
    
    // Empty response
    throw new Error('서버로부터 빈 응답을 받았습니다.');
  }
};

export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await safeJsonParse(response);
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (parseError) {
      // Use the default error message if parsing fails
    }
    
    throw new Error(errorMessage);
  }
  
  return safeJsonParse(response);
};