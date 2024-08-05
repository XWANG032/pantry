'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import {firestore } from '@/firebase'
import {collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from 'firebase/firestore'


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')
  const [display, setDisplay] = useState([])

  const handleSearch = event => {
    setSearch(event.target.value)
  }

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)
    const {quantity} = docSnap.data()
    await setDoc(docRef, {quantity: quantity + 1})
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  useEffect(() => {
    setDisplay(
      inventory.filter(item => 
        item.name.toLowerCase().startsWith(search.toLowerCase())
      )
    )
  }, [inventory, search])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform:"translate(-50%, -50%)"}}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) =>{setItemName(e.target.value)}}></TextField>
            <Button 
              variant="outlined" 
              onClick={()=>{
                addItem(itemName) 
                setItemName('')  
                handleClose()
              }}                                     
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="55vw" bgcolor = "violet" textAlign = "center">
        <Typography variant = "h2">What to Eat??</Typography>
      </Box>
      <Box border='1px solid #333'>
        <Box
        width = "800px"
        height = "auto"
        bgcolor = "#A45EE5"
        display="flex"
        flexDirection="column"
        alignItems="center" 
        justifyContent="center">
          <Typography variant="h2">
            Current Inventory
          </Typography>
          <TextField variant="outlined" fullWidth placeholder = "Search..."value={search} onChange = {handleSearch} ></TextField>
        </Box>
        <Box bgcolor ="#A45EE5" width = "800px" display="flex" justifyContent="center">
          <Button variant="contained" sx={{backgroundColor:"#E30B5C", "&:hover":{backgroundColor: "#DA70D6"}, }} onClick={() =>{
            handleOpen()
          }}>
            Add New Item
          </Button>
        </Box>
      <Stack width="800px" height="auto" spacing={1} autoflow="auto">
        {display.map(({name, quantity}) => (
          <Box 
          key={name} 
          width="100%" 
          minHeight="50px" 
          display = "grid"
          gridTemplateColumns = "repeat(4, 1fr)"         
          alignItems="center"
          justifyContent="space-between"
          bgColor="#f0f0f0"
          padding={2}
          >
            <Typography variant="h3" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" textAlign="center">
              {quantity}
            </Typography>
            <Button variant="contained" sx={{ width: '75%', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", backgroundColor: "#FF033E", "&:hover":{backgroundColor: "#A01641"}}} onClick={() =>{
              removeItem(name)
            }}
            >
              Remove
            </Button>
            <Button variant="contained" sx={{ width: '75%', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", backgroundColor: "#FF1D8D", "&:hover":{backgroundColor: "#FFB6C1"}}} onClick={() =>{
              incrementItem(name)
            }}>
              Add
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  )
}
