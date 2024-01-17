/* eslint-disable react-refresh/only-export-components */
import twemoji from "twemoji";

const Twemoji = ({ emoji, className }: { emoji: string, className: string }) => (
  <span className="flex justify-center items-center max-w-fit"
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: "svg",
        ext: ".svg",
        className: `${className} my-auto`
      }),
    }}
  />
);

export default Twemoji;
