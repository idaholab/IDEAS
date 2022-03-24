
// takes an object and a list of key names as strings and reduces the objects to
//   have only those entries that have key names from the list
export function simplified_object_array(
  obj_in: Array<any>,
  key_names: Array<string>
) {
  let new_array: Array<any> = [];
  obj_in.forEach(entry_in => {

    let temp_obj: any = {};

    key_names.forEach(name => {
      temp_obj[name] = entry_in[name]
    });

    new_array.push(temp_obj);
  })

  return new_array;
}


export function simplified_recursive_object_array(
  obj_in: Array<any>,
  key_names: Array<string>,
  recursive_key: string
) {
  let new_array: Array<any> = [];
  obj_in.forEach(entry_in => {

    let temp_obj: any = {};

    key_names.forEach(name => {
      temp_obj[name] = entry_in[name]
    });

    if (recursive_key in entry_in) {
      temp_obj[recursive_key] = simplified_recursive_object_array(
        entry_in[recursive_key],
        key_names,
        recursive_key
      )
    }

    new_array.push(temp_obj);
  })

  return new_array;
}
