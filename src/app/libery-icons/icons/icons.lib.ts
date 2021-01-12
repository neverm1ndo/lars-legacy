export interface LibertyIcon {
  name: string;
  color?: string;
  stroke?: number | boolean;
  data: string;
}
export const ltyLogo: LibertyIcon = {
  name: 'lty-logo',
  color: '#000000',
  stroke: false,
  data: `<svg class="lty-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M247.120 38.167 C 246.726 40.529,241.602 83.299,237.276 120.333 C 235.777 133.167,234.404 144.301,234.226 145.076 C 234.031 145.923,234.279 146.631,234.848 146.849 C 235.621 147.146,253.721 141.731,254.589 140.944 C 254.729 140.816,254.197 129.377,253.407 115.523 C 252.616 101.668,251.365 79.383,250.625 66.000 C 249.202 40.257,248.829 36.000,247.998 36.000 C 247.714 36.000,247.319 36.975,247.120 38.167 M116.431 68.833 C 117.002 69.767,122.316 77.764,127.395 85.333 C 135.020 96.695,147.090 114.891,148.333 116.898 C 149.910 119.443,155.629 128.152,157.594 131.000 C 158.352 132.100,162.343 138.100,166.462 144.333 C 175.567 158.113,181.480 166.670,182.215 167.129 C 182.842 167.521,196.667 153.543,196.667 152.517 C 196.667 151.582,194.129 148.724,181.701 135.667 C 175.769 129.433,166.734 119.845,161.624 114.359 C 156.514 108.873,147.083 98.828,140.667 92.036 C 134.250 85.244,126.600 77.091,123.667 73.919 C 119.177 69.065,114.609 65.854,116.431 68.833 M329.313 110.692 C 289.505 150.958,288.000 152.522,288.000 153.647 C 288.000 154.245,289.364 154.683,292.167 154.985 C 294.458 155.233,299.291 156.012,302.905 156.717 C 306.520 157.423,310.002 158.000,310.644 158.000 C 311.824 158.000,312.669 156.816,323.718 139.667 C 326.789 134.900,330.514 129.200,331.995 127.000 C 333.476 124.800,336.680 119.850,339.114 116.000 C 343.315 109.354,347.601 102.762,356.020 90.000 C 368.429 71.189,368.168 71.390,329.313 110.692 M231.667 151.504 C 229.467 151.871,227.583 152.240,227.482 152.326 C 227.380 152.411,228.078 154.954,229.032 157.975 L 230.768 163.470 233.884 163.006 C 235.598 162.751,237.048 162.495,237.106 162.438 C 237.424 162.124,236.413 150.681,236.073 150.752 C 235.849 150.799,233.867 151.138,231.667 151.504 M246.330 154.751 C 247.057 162.199,246.940 162.000,250.560 162.000 L 253.761 162.000 254.554 156.896 C 255.495 150.846,255.997 151.571,250.458 150.984 L 245.915 150.502 246.330 154.751 M25.333 152.219 C 25.333 152.687,27.208 153.968,29.500 155.065 C 35.185 157.785,54.814 168.045,55.785 168.803 C 56.217 169.141,59.367 170.857,62.785 172.617 C 70.180 176.424,76.560 179.789,91.333 187.677 C 97.383 190.907,104.583 194.727,107.333 196.166 C 110.083 197.604,113.833 199.632,115.667 200.671 C 117.500 201.710,122.150 204.188,126.000 206.178 C 129.850 208.168,134.950 210.885,137.333 212.216 C 144.003 215.941,142.844 217.228,153.816 193.921 C 157.055 187.042,157.121 187.188,150.000 185.512 C 144.621 184.247,137.625 182.301,106.000 173.277 C 98.483 171.133,90.533 168.956,88.333 168.440 C 86.133 167.924,78.333 165.794,71.000 163.706 C 29.460 151.879,25.333 150.841,25.333 152.219 M394.333 154.469 C 391.767 155.790,386.667 158.136,383.000 159.681 C 379.333 161.226,373.258 164.001,369.500 165.846 C 365.742 167.691,362.667 169.099,362.667 168.973 C 362.667 168.848,358.591 170.678,353.609 173.040 C 348.627 175.401,344.307 177.333,344.010 177.333 C 343.019 177.333,329.333 184.112,329.333 184.603 C 329.333 185.313,333.496 187.206,340.635 189.741 L 346.937 191.979 352.404 188.266 C 355.411 186.224,358.483 183.983,359.231 183.286 C 359.979 182.589,361.883 181.189,363.462 180.175 C 365.041 179.162,368.283 176.894,370.667 175.137 C 382.154 166.668,386.824 163.331,387.227 163.306 C 387.469 163.291,389.317 161.949,391.333 160.324 C 393.350 158.698,396.123 156.685,397.495 155.851 C 403.189 152.388,400.585 151.249,394.333 154.469 M265.087 154.833 C 264.866 155.658,264.681 158.032,264.676 160.108 L 264.667 163.883 267.397 164.344 C 270.620 164.889,270.823 164.725,272.619 160.142 C 274.536 155.249,274.453 155.000,270.616 154.114 C 266.003 153.050,265.549 153.109,265.087 154.833 M213.333 155.483 C 211.317 156.226,209.577 156.911,209.466 157.006 C 209.356 157.101,210.548 159.763,212.115 162.922 C 215.183 169.109,215.552 169.343,219.585 167.658 C 222.374 166.492,222.340 166.706,220.909 159.500 C 219.659 153.201,219.607 153.173,213.333 155.483 M196.934 162.421 C 194.404 163.752,192.251 164.910,192.151 164.992 C 192.050 165.075,193.343 167.011,195.024 169.294 C 196.704 171.577,198.410 174.170,198.813 175.056 C 199.734 177.077,200.085 177.067,204.076 174.894 C 207.968 172.776,207.913 173.387,204.885 165.985 C 202.041 159.030,202.763 159.354,196.934 162.421 M282.698 161.584 C 281.800 163.946,280.549 168.779,280.790 168.955 C 285.004 172.034,285.213 172.007,288.220 167.978 C 291.840 163.130,291.838 163.048,288.077 161.430 C 283.890 159.629,283.437 159.642,282.698 161.584 M181.500 172.087 C 176.306 176.290,176.292 176.134,182.370 181.948 L 187.406 186.766 190.349 184.550 C 194.125 181.706,194.123 180.454,190.333 174.596 C 188.683 172.045,187.333 169.668,187.333 169.313 C 187.333 167.968,185.531 168.826,181.500 172.087 M296.725 172.462 L 294.450 176.219 296.391 177.773 C 298.997 179.857,299.269 179.795,302.663 176.337 L 305.603 173.342 303.337 171.004 C 300.290 167.860,299.391 168.058,296.725 172.462 M239.366 171.821 C 230.096 173.560,206.186 185.145,198.552 191.597 C 178.380 208.645,165.970 222.011,162.820 230.081 C 161.621 233.153,160.845 234.617,161.097 233.333 C 162.032 228.569,162.134 228.694,155.333 226.212 C 145.063 222.463,145.950 222.199,143.947 229.601 C 141.815 237.482,141.358 236.966,151.410 238.009 C 159.171 238.814,159.793 238.980,159.484 240.164 C 158.945 242.225,157.842 242.211,150.612 240.048 C 142.632 237.661,141.560 237.570,141.030 239.239 C 140.620 240.530,129.694 242.359,112.000 244.096 C 104.247 244.858,73.572 248.663,58.903 250.683 C 53.716 251.398,46.066 252.276,41.903 252.636 C 21.720 254.381,-1.080 257.811,0.044 258.933 C 0.435 259.323,106.131 264.590,123.500 265.086 L 137.333 265.480 137.333 271.073 L 137.333 276.667 141.045 276.667 C 144.588 276.667,144.735 276.735,144.281 278.163 C 142.364 284.206,146.832 289.992,153.418 289.998 C 158.235 290.001,159.517 292.868,155.622 294.925 C 154.183 295.685,145.105 301.504,135.000 308.143 C 131.333 310.552,128.025 312.630,127.648 312.761 C 127.271 312.893,123.821 315.064,119.981 317.588 C 105.856 326.869,102.207 329.243,96.333 332.964 C 89.388 337.366,84.947 340.233,73.365 347.794 C 68.764 350.798,64.100 353.733,63.000 354.317 C 61.900 354.902,59.800 356.251,58.333 357.317 C 56.867 358.382,54.017 360.247,52.000 361.460 C 45.919 365.119,50.426 364.788,60.942 360.804 C 76.781 354.802,84.902 351.806,93.000 348.975 C 97.400 347.437,103.850 345.060,107.333 343.692 C 110.817 342.324,115.017 340.794,116.667 340.291 C 118.317 339.788,123.858 337.717,128.981 335.688 C 134.104 333.660,138.629 332.000,139.037 332.000 C 139.445 332.000,143.598 330.500,148.268 328.667 C 156.747 325.337,156.766 325.333,164.545 325.343 C 174.483 325.356,174.694 325.477,178.909 333.589 L 182.333 340.178 192.667 339.805 C 220.089 338.813,255.672 328.568,266.080 318.667 C 273.192 311.901,267.336 310.060,236.333 309.316 C 196.399 308.357,186.512 305.029,185.005 292.039 C 184.610 288.643,184.235 287.784,182.656 286.659 C 180.889 285.401,180.820 285.173,181.496 282.827 C 181.891 281.456,182.241 276.283,182.274 271.333 C 182.350 259.892,187.527 248.000,192.432 248.000 C 195.268 248.000,207.236 241.260,210.661 237.733 C 216.111 232.124,224.075 230.732,230.423 234.279 C 234.432 236.520,234.147 236.590,238.690 232.256 C 244.290 226.915,247.047 215.831,244.455 209.077 C 243.441 206.433,222.294 208.966,212.135 212.947 C 206.782 215.045,202.719 217.892,196.500 223.904 C 193.658 226.650,191.343 228.621,191.354 228.282 C 191.420 226.337,199.166 216.773,206.799 209.211 C 212.760 203.306,222.896 196.464,236.000 189.500 C 238.750 188.038,243.796 185.136,247.213 183.049 C 255.207 178.168,254.811 178.259,256.277 180.981 C 257.259 182.806,258.719 183.890,262.934 185.927 C 293.822 200.852,294.542 201.257,299.966 206.747 C 303.202 210.024,308.613 216.927,311.529 221.500 C 312.815 223.517,314.667 223.957,314.667 222.245 C 314.667 214.383,298.282 191.779,289.048 186.902 C 287.067 185.856,282.451 183.275,278.790 181.167 C 275.129 179.058,271.764 177.333,271.312 177.333 C 270.860 177.333,269.555 176.756,268.412 176.050 C 262.074 172.137,248.342 170.138,239.366 171.821 M168.435 183.951 C 163.713 188.901,163.568 188.302,170.678 193.196 C 177.728 198.049,176.966 197.868,179.210 195.223 C 183.087 190.650,183.060 190.801,180.527 188.109 C 179.264 186.766,177.253 184.392,176.059 182.833 C 173.267 179.189,172.929 179.239,168.435 183.951 M309.391 182.973 L 306.450 185.823 307.937 187.911 C 309.714 190.407,309.145 190.361,313.648 188.370 C 317.878 186.499,317.992 186.144,315.500 182.621 C 313.244 179.431,313.037 179.443,309.391 182.973 M159.709 194.363 C 153.969 203.123,153.926 203.366,157.836 204.944 C 159.576 205.646,162.556 206.921,164.457 207.777 C 169.018 209.830,169.019 209.830,171.319 206.167 C 174.012 201.880,174.061 202.009,167.859 197.047 C 161.712 192.129,161.268 191.983,159.709 194.363 M150.186 211.833 C 146.999 219.030,146.942 219.768,149.500 220.608 C 151.124 221.142,163.641 224.000,164.353 224.000 C 164.658 224.000,168.138 215.249,167.919 215.032 C 167.190 214.308,153.648 207.333,152.973 207.333 C 152.536 207.333,151.282 209.358,150.186 211.833 M271.000 208.935 C 267.222 210.603,266.435 212.164,266.127 218.594 C 265.523 231.227,271.091 239.794,276.788 235.000 C 283.191 229.613,297.227 234.715,303.031 244.539 C 305.783 249.199,313.659 247.651,316.005 241.988 C 320.795 230.424,287.741 209.934,275.835 217.088 C 275.229 217.452,275.242 217.290,275.885 216.498 C 277.293 214.760,283.613 213.782,290.527 214.231 C 295.706 214.568,296.785 214.469,297.109 213.622 C 298.286 210.556,276.279 206.605,271.000 208.935 M245.317 243.650 C 236.770 248.295,232.103 262.000,239.067 262.000 C 244.581 262.000,245.511 264.484,240.646 266.212 C 233.168 268.867,230.000 272.368,230.000 277.973 C 230.000 281.343,231.781 281.680,233.571 278.649 C 239.902 267.932,261.446 267.641,272.130 278.128 C 276.890 282.800,278.000 283.024,278.000 279.312 C 278.000 275.660,276.625 272.644,273.924 270.373 C 272.682 269.330,269.756 266.725,267.420 264.586 L 263.173 260.696 267.753 260.848 L 272.333 261.000 272.205 258.149 C 271.670 246.233,256.055 237.812,245.317 243.650 M239.961 277.299 C 236.923 278.221,235.367 279.334,234.340 281.320 C 232.550 284.782,232.457 284.757,245.167 284.279 C 254.677 283.921,258.546 284.059,264.877 284.984 C 273.683 286.272,273.837 286.241,272.415 283.491 C 269.975 278.772,248.567 274.687,239.961 277.299 " stroke="none" fill="#FDFDFD" fill-rule="evenodd"></path></g></svg>`
}
export const ltyOld: LibertyIcon = {
  name: 'lty-old',
  color: '#000000',
  stroke: false,
  data: `<svg class="lty-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 300 300" width="64" height="64"><defs><path d="M13.63 27.94L177.5 27.94L177.5 101.07L96.32 101.07L96.32 277.94L13.63 277.94L13.63 27.94Z" id="bh8Xu6F6b"></path><path d="M197.24 204.81L197.24 27.94L279.93 27.94L279.93 277.94L116.05 277.94L116.05 204.81L197.24 204.81Z" id="a3qVZuQh"></path></defs><g><g><g><use xlink:href="#bh8Xu6F6b" opacity="1" fill="#FDFDFD" fill-opacity="1"></use></g><g><use xlink:href="#a3qVZuQh" opacity="1" fill="#FDFDFD" fill-opacity="1"></use></g></g></g></svg>`
}
export type ltyIcon = 'lty-logo' | 'lty-old';
