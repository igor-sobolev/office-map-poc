export const updateObjectsPosition = async (building, objects) => {
  try {
    const result = await fetch(
      `http://localhost:8080/buildings/${building.name}/objects`,
      {
        body: JSON.stringify(objects),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return result;
  } catch (e) {
    // @TODO: handle error
    console.log(e);
  }
};
