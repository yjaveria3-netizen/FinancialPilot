import streamlit as st
from services.gemini import ask

st.title("FinPilot")
st.caption("Synthetic data demo")

if st.button("Test Gemini"):
    st.write(ask("Say hello in one short sentence.", st.secrets["GEMINI_KEY"]))