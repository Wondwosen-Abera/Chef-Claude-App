import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "../ai";
import Loader from "./Loader";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [waiting, setWaiting] = React.useState(false);
  const recipeSection = React.useRef(null);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current !== null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe() {
    setWaiting(true);
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);
  }

  function addIngredient(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      event.target.reset(); // Clear the input field after submission
    }
  }

  function clearIngredients(event) {
    event.preventDefault(); // Prevent default button behavior
    setIngredients([]);
    setRecipe("");
    setWaiting(false);
  }

  return (
    <>
      <main>
        <form onSubmit={addIngredient} className="add-ingredient-form">
          <input
            type="text"
            placeholder="e.g. oregano"
            aria-label="Add ingredient"
            name="ingredient"
          />
          <button className="add-ingredient" type="submit">
            Add ingredient
          </button>
          <button className="new-ingredients" onClick={clearIngredients}>
            New
          </button>
        </form>

        {ingredients.length > 0 && (
          <IngredientsList
            reff={recipeSection}
            ingredients={ingredients}
            getRecipe={getRecipe}
          />
        )}

        {recipe ? (
          <ClaudeRecipe recipe={recipe} />
        ) : waiting ? (
          <Loader />
        ) : null}
      </main>
    </>
  );
}
