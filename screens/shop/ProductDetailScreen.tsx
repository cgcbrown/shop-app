import React from "react";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import {
  View,
  StyleSheet,
  Image,
  Button,
  Text,
  ScrollView,
} from "react-native";
import { RootState } from '../../store'
import { useSelector, useDispatch } from "react-redux";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as cartActions from '../../store/actions/cart'

const ProductDetailScreen: NavigationStackScreenComponent = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const productId = navigation.getParam("productId");
  const selectedProduct = useSelector((state: RootState) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  if (!selectedProduct) return null

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
      <View style={styles.actions}>
        <Button
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct))
          }}
          color={Colors.primary} />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle')
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans'
  }
});

export default ProductDetailScreen;
