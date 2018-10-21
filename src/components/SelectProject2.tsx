import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Downshift from "downshift";
import keycode from "keycode";
import deburr from "lodash/deburr";
import PropTypes from "prop-types";
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
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
              const keep =
                  count < 5 &&
                  suggestion.label.slice(0, inputLength).toLowerCase() ===
                      inputValue;

              if (keep) {
                  count += 1;
              }

              return keep;
          });
}

function IntegrationDownshift(props: any) {
    return (
        <div>
            <Downshift id="downshift-simple">
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
