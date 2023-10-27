import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });

export default function ParagraphVideo(props) {
  const url = props?.field_video?.field_media_oembed_video;

  function validYouTubeVideo() {
    if (!!url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length == 11) {
        return true;
      }
    }
    return false;
  }

  if (!validYouTubeVideo()) return null;

  return (
    <div className="print:hidden pt-[56.25%] relative">
      <ReactPlayer className="react-player" controls url={url} width="100%" height="100%" />
    </div>
  );
}
