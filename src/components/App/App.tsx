import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import {
  fetchNotes,
  createNote,
  type FetchNotesResponse,
} from "../../services/noteService";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}


      {}
      {!isLoading && !isError && data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </Modal>
      )}
    </div>
  );
}
