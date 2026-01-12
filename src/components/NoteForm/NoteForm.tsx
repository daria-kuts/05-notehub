import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

interface Values {
  title: string;
  content: string;
  tag: string;
}

interface Props {
  onSubmit: (values: Values) => void;
  onCancel: () => void;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

export default function NoteForm({ onSubmit, onCancel }: Props) {
  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" onClick={onCancel} className={css.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={css.submitButton}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
