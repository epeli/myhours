import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Downshift, {DownshiftInterface} from "downshift";
import matchSorter from "match-sorter";
import React from "react";

function renderSuggestion({
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
}: {
    suggestion: {label: string};
    index: number;
    itemProps: any;
    highlightedIndex: number | null;
    selectedItem: any;
}) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.label}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.label}
        </MenuItem>
    );
}

function getSuggestions(suggestions: Item[], value: string) {
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
                                    {getSuggestions(
                                        props.items,
                                        ds.inputValue || "",
                                    ).map((suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: ds.getItemProps({
                                                item: suggestion,
                                            }),
                                            highlightedIndex:
                                                ds.highlightedIndex,
                                            selectedItem: ds.selectedItem,
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
