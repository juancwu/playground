import { useEffect, useRef, useState } from "react";

export default function Fruit({ name, className }) {
  const fruitRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const importFruit = async () => {
      try {
        const { default: fruit } = await import(`../assets/${name}.svg`);
        fruitRef.current = fruit;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    importFruit();
  }, [name]);

  if (!loading && fruitRef.current) {
    const { current: FruitAvatar } = fruitRef;

    return <img src={FruitAvatar} alt="fruit avatar" className={className} />;
  }

  return null;
}
