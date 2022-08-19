import './SearchBar.scss';
import { useDispatch } from "react-redux"
import { actions } from "../../../redux/todo-reducer"
import React from 'react';

export const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const dataSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        dispatch(actions.searchTasks(value));
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                className="search-bar__input"
                placeholder="Search by title..."
                onChange={dataSearch}
            />
        </div>
      );
}