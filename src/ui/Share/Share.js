import styles from "./share.module.css";

const Share = ({ content_, showToast }) => {
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?content=${encodeURIComponent(content_)}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  return (
    <span className={styles.shareButton} onClick={handleShare}>
      share
    </span>
  );
};

export default Share;
