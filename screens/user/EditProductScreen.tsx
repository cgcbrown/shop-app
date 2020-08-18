import React, { useEffect, useCallback, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";
import Input from '../../components/UI/Input';

const FORM_INPUT_UPDATE = "UPDATE";

export interface InputValidities {
  [key: string]: boolean
}

export interface formStateComponent {
  inputValues: {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
  };
  inputValidities: InputValidities;
  formIsValid: boolean;
}

export interface formAction {
  type: typeof FORM_INPUT_UPDATE;
  value: string,
  isValid: boolean,
  input: string
}

const formReducer = (state: formStateComponent, action: formAction) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    }
  }
  return state
};

const EditProductScreen: NavigationStackScreenComponent = ({ navigation }) => {
  const prodId = navigation.getParam("productId");
  const editedProduct = useSelector((state: RootState) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      price: "",
      description: editedProduct ? editedProduct.description : "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", [
        { text: "Okay!" },
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        productActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl)
      );
    } else {
      dispatch(
        productActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price)
      );
    }
    navigation.goBack();
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback((inputIdentifier:string, text: string, validity: boolean) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: validity,
      input: inputIdentifier
    });
  }, [dispatchFormState]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="title"
          label="title"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          errorText="Please enter a valid title!"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ""}
          initiallyValid={!!editedProduct}
          required
        />
        <Input
          id="imageUrl"
          label="Image Url"
          keyboardType="default"
          returnKeyType="next"
          errorText="Please enter a valid image url!"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ""}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct ? null : (
          <Input
            id="price"
            label="Price"
            keyboardType="decimal-pad"
            returnKeyType="next"
            errorText="Please enter a valid price!"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
        )}
        <Input
          id="description"
          label="Description"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          errorText="Please enter a valid description!"
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.description : ""}
          initiallyValid={!!editedProduct}
          minLength={5}
          required
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});

EditProductScreen.navigationOptions = (navData) => {
  const submitFunction = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitFunction}
          />
        </HeaderButtons>
      );
    },
  };
};

export default EditProductScreen;
