import { useField } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';

export function MultiSelectTypeahead(props) {
  const [field] = useField(props.name);
  return (
    <Typeahead
      {...field}
      {...props}
      onChange={(value) => {
        field.onChange({ target: { id: props.id, name: props.name, value } });
      }}
      defaultSelected={field.value}
      inputProps={{ ...props }}
      multiple
    />
  );
}

export default MultiSelectTypeahead;
