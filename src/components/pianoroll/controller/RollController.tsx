import React from "react";
import RollForm from "./RollForm";
import RollList from "./RollList";

const RollController: React.FC = () => {
  return (
    <article className="w-1/6">
      <h1 className="text-center">RollController</h1>
      <RollForm />
      <hr className="border-none h-3.5" />
      <RollList />
    </article>
  );
};
export default RollController;
