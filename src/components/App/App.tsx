import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import type { FetchNotesResponse } from "../../services/noteService";

import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";

import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
  queryKey: ["notes", page, debouncedSearch],
  queryFn: () =>
    fetchNotes({
      page,
      perPage: PER_PAGE,
      search: debouncedSearch || undefined,
    }),
  placeholderData: keepPreviousData,
});


  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
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

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
