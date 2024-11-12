// utils/uriToBlob.ts
export const uriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // Hoàn thành, trả về Blob
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      // Lỗi khi tải xuống
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};
