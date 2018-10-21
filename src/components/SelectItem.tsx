import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Downshift, {DownshiftInterface} from "downshift";
import matchSorter from "match-sorter";
import React from "react";

import {View} from "./core";

function renderItem({
    item,
    index,
    itemProps,
    highlightedIndex,
}: {
    item: Item;
    index: number;
    itemProps: any;
    highlightedIndex: number | null;
}) {
    const isHighlighted = highlightedIndex === index;

    return (
        <MenuItem
            {...itemProps}
            key={item.label}
            selected={isHighlighted}
            component="div"
        >
            {item.label}
        </MenuItem>
    );
}

function filterItems(suggestions: Item[], value: string) {
    return matchSorter(suggestions, value, {keys: ["label"]}).slice(0, 10);
}

interface Item {
    label: string;
}

interface Props<T extends Item> {
    className?: string;
    items: T[];
    onSelect(item: T): void;
    inputValue: string;
    onInputValueChange(value: string): void;
}

const TypedDownshift: DownshiftInterface<Item> = Downshift;

function SelectItem<T extends Item>(props: Props<T>) {
    return (
        <TypedDownshift
            inputValue={props.inputValue}
            onChange={(item, state) => {
                if (!item) {
                    return;
                }
                props.onSelect(item as T);
                state.clearSelection();
            }}
            itemToString={item => (item ? item.label : "")}
            onInputValueChange={value => {
                props.onInputValueChange(value);
            }}
            onStateChange={(changes, state) => {
                if (!state.highlightedIndex) {
                    state.setHighlightedIndex(0);
                }
            }}
        >
            {ds => (
                <View
                    {...ds.getRootProps({
                        refKey: "innerRef",
                        // className: this.props.className,
                    })}
                    className={props.className}
                >
                    <TextField
                        fullWidth
                        InputProps={ds.getInputProps({
                            placeholder: "Select project",
                        })}
                    />
                    <div {...ds.getMenuProps()}>
                        {ds.isOpen && (
                            <Paper square>
                                {filterItems(
                                    props.items,
                                    ds.inputValue || "",
                                ).map((item, index) =>
                                    renderItem({
                                        item,
                                        index,
                                        itemProps: ds.getItemProps({
                                            item: item,
                                        }),
                                        highlightedIndex: ds.highlightedIndex,
                                    }),
                                )}
                            </Paper>
                        )}
                    </div>
                </View>
            )}
        </TypedDownshift>
    );
}

export default SelectItem;
