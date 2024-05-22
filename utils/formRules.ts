const required = (val: string) => {
  console.log(val);
  return (val && !!val.length) || "Field is required";
};

const length = (min?: number, max?: number) => (val: string) => {
  if (min !== undefined) {
    if (val && val.length < min) {
      return "Too short, must be at least " + min + " characters long";
    }
  }
  if (max !== undefined) {
    if (val && val.length > max) {
      return "Too long, must be at most " + max + " characters long";
    }
  }
  return true;
};

const integer = (val: string | number) => {
  // this rule doesn't mean the field is required
  // if the value is null/undefined/empty string thats okay
  let v: number;
  if (typeof val === "string") {
    if (val.length === 0) return true;
    v = parseFloat(val);
  } else if (typeof val === "number") {
    v = val;
  } else {
    return true;
  }
  if (isNaN(v) || Math.round(v) !== v) {
    return "Value must be an integer";
  }
  return true;
};

export default {
  required,
  length,
  integer,
};
