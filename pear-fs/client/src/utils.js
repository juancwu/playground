export function getRandomFruitName() {
  let names = [
    "apple",
    "apricot",
    "avocado",
    "banana",
    "blackberry",
    "blueberry",
    "cherry",
    "dragon-fruit",
    "fig",
    "grape",
    "grapefruit",
    "green-apple",
    "kiwi",
    "lemon",
    "lime",
    "mango",
    "mangosteen",
    "melon",
    "nectarine",
    "orange",
    "papaya",
    "passion-fruit",
    "persimmon",
    "pineapple",
    "plum",
    "raspberry",
    "rose-apple",
    "strawberry",
    "watermelon",
  ];

  let name = names[Math.floor(Math.random() * names.length)];
  names = null;
  return name;
}
