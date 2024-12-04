interface VideoItemProps {
  item: Post;
  isActive: boolean;
  onClosed?: () => void;
}

const VideoItem = ({ item, isActive, onClosed }: VideoItemProps) => {
  // ... code khác giữ nguyên

  // Thêm nút đóng hoặc xử lý sự kiện đóng video
  const handleClose = () => {
    if (onClosed) {
      onClosed();
    }
  };

  // ... return JSX
};
