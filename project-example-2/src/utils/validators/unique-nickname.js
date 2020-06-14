import profileAPI from "@/api/profile";

export default function uniqueNickname(value, others) {
  if (value === "") return true;
  if (value === others.ownNickname) return true;

  return profileAPI
    .isUniqueNickname(value)
    .then(response => response)
    .catch(e => console.error(e));
}
