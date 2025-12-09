import { useState, useEffect } from "react";
//import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";

interface TextAreaInputProps {
  onTextChange?: (text: string) => void;
  initialValue?: string; // 初始值（用于路由切换后恢复）
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ onTextChange, initialValue = "" }) => {
  const [message, setMessage] = useState(initialValue);

  // 当 initialValue 变化时更新
  useEffect(() => {
    setMessage(initialValue);
  }, [initialValue]);

  const handleChange = (value: string) => {
    setMessage(value);
    onTextChange?.(value);
  };

  return (
      <div className="space-y-6">
        {/* Default TextArea */}
        <div>
          <Label>Description Of your Stone</Label>
          <TextArea
            value={message}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/*/!* Disabled TextArea *!/*/}
        {/*<div>*/}
        {/*  <Label>Description</Label>*/}
        {/*  <TextArea rows={6} disabled />*/}
        {/*</div>*/}

      </div>
  );
};

export default TextAreaInput;
