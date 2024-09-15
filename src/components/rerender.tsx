import Quill from "quill";
import { useState, useEffect, useRef } from "react";

interface RerenderProps {
  value: string;
}

const Rerender = ({ value }: RerenderProps) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const rerenderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rerenderRef.current) return;
    const container = rerenderRef.current;
    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });
    quill.enable(false);
    const contents = JSON.parse(value);
    quill.setContents(contents);

    setIsEmpty(
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0
    );
    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return <div ref={rerenderRef} className='ql-editor ql-renderer' />;
};

export default Rerender;
