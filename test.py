from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np
import matplotlib.pyplot as plt

X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Y = [2, 1.5, 1.3, 0.8, 0.7,
     0.9, 1.1, 1.3, 1.7, 3]

X = np.reshape(X, (len(X), 1))
Y = np.reshape(Y, (len(Y), 1))

poly_features = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly_features.fit_transform(X)
lin_reg = LinearRegression()
lin_reg.fit(X_poly, Y)
lin_reg.intercept_, lin_reg.coef_
X_new_poly = poly_features.transform(X)
y_new = lin_reg.predict(X_new_poly)
plt.plot(X, Y, "b.")
plt.plot(X, y_new, "r-", linewidth=2, label="Predictions")
plt.xlabel("$x_1$", fontsize=18)
plt.ylabel("$y$", rotation=0, fontsize=18)
plt.show()
