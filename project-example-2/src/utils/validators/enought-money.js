import createStore from "@/store";

const store = createStore();

export default function enoughtMoney(value) {
  if (value === "") return true;

  const amount = Math.abs(
    parseFloat(value.replace(/\s/g, "").replace(/,/g, "."), 10)
  );

  return store.getters["finance/agentBalance"] >= amount;
}
