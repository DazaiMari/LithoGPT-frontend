import { useState, useEffect } from "react";
// import Label from "../Label";
// import Select from "../Select";
import MultiSelect from "../MultiSelect";

interface TextSelectAreaInputProps {
  onTextChange?: (options: string, values: string[]) => void; // 同时返回文本和 values
  initialValues?: string[]; // 初始选中值（用于路由切换后恢复）
}

const multiOptions = [
  { value: "1", text: "Taoist style: returning to simplicity and authenticity, following nature's course", selected: false },
  { value: "2", text: "Confucian style: expressing aspirations through objects, viewing things through the lens of virtue", selected: false },
  { value: "3", text: "Buddhist Style: Dependent Origination and Emptiness; Contemplating the Mind to See One's True Nature", selected: false },
  { value: "4", text: "Historical Approach: Reading Civilisation Through Stratigraphy, Observing Time Through Texture", selected: false },
  { value: "5", text: "Philosophical Style: Contemplations on Time, Existence, and Destiny", selected: false },
];

// 将 options 文本转换回 values
const textToValues = (text: string): string[] => {
  if (!text) return [];
  const texts = text.split(",");
  return texts
    .map((t) => {
      const found = multiOptions.find((opt) => opt.text === t.trim());
      return found?.value || "";
    })
    .filter(Boolean);
};

const SelectInputs: React.FC<TextSelectAreaInputProps> = ({ onTextChange, initialValues }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues || []);

  // 当 initialValues 变化时更新
  useEffect(() => {
    if (initialValues) {
      setSelectedValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (values: string[]) => {
    setSelectedValues(values);
    // 根据 selectedValues 找到对应 text
    const requestOptions = values
      .map((value) => {
        const found = multiOptions.find((opt) => opt.value === value);
        return found ? found.text : "";
      })
      .filter(Boolean)
      .join(",");
    onTextChange?.(requestOptions, values); // 同时返回 options 和 values
  };

  return (
    <div className="space-y-6">
      <div>
        <MultiSelect
          label="Select Some Inspirations"
          options={multiOptions}
          defaultSelected={selectedValues}
          onChange={handleChange}
        />
        <p className="sr-only">Selected Values: {selectedValues.join(", ")}</p>
      </div>
    </div>
  );
};

export { textToValues };
export default SelectInputs;


