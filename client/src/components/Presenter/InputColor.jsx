import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { t } from 'i18next';

const InputWrapper = styled('div')(
  () => `
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: .5rem;
  display: flex;
  flex-wrap: wrap;

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  () => `
  display: flex;
  align-items: center;
  height: 34px;
  margin: 2px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius:10rem;
  padding: 4px 10px;
  gap:3px;

  & span {
    font-size:20px;
    
  }
  & svg {
    font-size: 16px;
    cursor: pointer;
  }
`
);

const Listbox = styled('ul')(
  () => `
  width: 200px;
  position: absolute;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color:#fafafa;
    font-weight: 700;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color:#e6f7ff;
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export default function InputColor({ colors, setColors }) {
  const allColors = ['Red', 'Gray', 'Black', 'Brown', 'Off-White', 'Green'];
  const [value, setValue] = useState(colors);

  const {
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    value,
    onChange: (event, newValue) => {
      setValue(newValue);
      setColors(newValue);
    },
    multiple: true,
    options: allColors,
    getOptionLabel: (option) => option,
  });

  useEffect(() => {
    setValue(colors);
  }, [colors]);

  return (
    <>
      <div>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.map((option, index) => (
            <StyledTag key={index} label={t(option)} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li key={index} {...getOptionProps({ option, index })}>
              <span>{t(option)}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </>
  );
}

InputColor.propTypes = {
  colors: PropTypes.array.isRequired,
  setColors: PropTypes.func.isRequired,
};
