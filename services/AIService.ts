const FLOWISE_API_URL = process.env.EXPO_PUBLIC_FLOWISE_API_URL;

export const generateResponse = async (prompt: string) => {
  try {
    const payload = {
      question: prompt,
    };

    const response = await fetch(FLOWISE_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result) {
      return result;
    }

    throw new Error("Không nhận được phản hồi hợp lệ từ API");
  } catch (error: any) {
    throw new Error(
      error.message || "Không thể tạo bình luận. Vui lòng thử lại.",
    );
  }
};
