import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import deburr from "lodash/deburr";
import matchSorter from "match-sorter";
import React from "react";

const suggestions = [
    {label: "Afghanistan"},
    {label: "Aland Islands"},
    {label: "Albania"},
    {label: "Algeria"},
    {label: "American Samoa"},
    {label: "Andorra"},
    {label: "Angola"},
    {label: "Anguilla"},
    {label: "Antarctica"},
    {label: "Antigua and Barbuda"},
    {label: "Argentina"},
    {label: "Armenia"},
    {label: "Aruba"},
    {label: "Australia"},
    {label: "Austria"},
    {label: "Azerbaijan"},
    {label: "Bahamas"},
    {label: "Bahrain"},
    {label: "Bangladesh"},
    {label: "Barbados"},
    {label: "Belarus"},
    {label: "Belgium"},
    {label: "Belize"},
    {label: "Benin"},
    {label: "Bermuda"},
    {label: "Bhutan"},
    {label: "Bolivia, Plurinational State of"},
    {label: "Bonaire, Sint Eustatius and Saba"},
    {label: "Bosnia and Herzegovina"},
    {label: "Botswana"},
    {label: "Bouvet Island"},
    {label: "Brazil"},
    {label: "British Indian Ocean Territory"},
    {label: "Brunei Darussalam"},
];

function renderInput(inputProps: any) {
    const {InputProps, ref, ...other} = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                ...InputProps,
            }}
            {...other}
        />
    );
}

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

function getSuggestions(value: string) {
    return matchSorter(suggestions, value, {keys: ["label"]}).slice(0, 10);
}

function IntegrationDownshift() {
    return (
        <div>
            <Downshift
                onSelect={e => {
                    console.log("select", e);
                }}
                onStateChange={(changes, state) => {
                    if (!state.highlightedIndex) {
                        state.setHighlightedIndex(0);
                    }
                }}
            >
                {ds => (
                    <div>
                        {renderInput({
                            fullWidth: true,
                            InputProps: ds.getInputProps({
                                placeholder: "Select project",
                            }),
                        })}
                        <div {...ds.getMenuProps()}>
                            {ds.isOpen ? (
                                <Paper square>
                                    {getSuggestions(ds.inputValue || "").map(
                                        (suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: ds.getItemProps({
                                                    item: suggestion.label,
                                                }),
                                                highlightedIndex:
                                                    ds.highlightedIndex,
                                                selectedItem: ds.selectedItem,
                                            }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    </div>
                )}
            </Downshift>
        </div>
    );
}

export default IntegrationDownshift;
