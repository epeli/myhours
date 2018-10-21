import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Downshift, {DownshiftInterface} from "downshift";
import matchSorter from "match-sorter";
import React from "react";

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
    items: T[];
    onSelect(item: T): void;
    onInputValueChange(value: string): void;
}

const TypedDownshift: DownshiftInterface<Item> = Downshift;

function SelectItem<T extends Item>(props: Props<T>) {
    return (
        <div>
            <TypedDownshift
                onSelect={item => {
                    props.onSelect(item as T);
                    console.log("select", item);
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
                    <div>
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
                                            highlightedIndex:
                                                ds.highlightedIndex,
                                        }),
                                    )}
                                </Paper>
                            )}
                        </div>
                    </div>
                )}
            </TypedDownshift>
        </div>
    );
}

export default SelectItem;
