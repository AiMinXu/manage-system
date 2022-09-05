export const CollapsedReducer = (prevState = {
  isCollapsed: true,
}, action) => {
  // console.log(action)
  // console.log(prevState);
  let { type } = action;
  switch (type) {
    case 'change_collapsed':
      let newState = { ...prevState };
      newState.isCollapsed = !newState.isCollapsed;
      return newState;
    default:
      return prevState;
  }
}
