import React, { useState } from "react";
import { menuData, categories } from "../data/menu";
import MenuCategories from "./MenuCategories";
import SpecialsBanner from "./SpecialsBanner"; 
import MenuGrid from "./MenuGrid";

function Menu({ onItemSelected, mainContentRef }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
  const items = menuData[selectedCategory];

  const specialItem = menuData.mainDishes.find((item) => item.id === "m1");

  return (
    <section id="menu" className="pb-16 max-w-5xl mx-auto">
      <MenuCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        mainContentRef={mainContentRef}
      />

      <div className="my-6">
        <SpecialsBanner
          item={specialItem}
          onClick={() => onItemSelected(specialItem)}
        />
      </div>

      <MenuGrid
        key={selectedCategory}
        items={items}
        onItemSelected={onItemSelected}
      />
    </section>
  );
}

export default Menu;
