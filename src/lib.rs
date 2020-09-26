extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn multiply(first: u8, second: u8) -> i32 {
    i32::from(first) * i32::from(second)
}
