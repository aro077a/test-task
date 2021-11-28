import {
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Pagination,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { shallowEqual } from "react-redux";
import {
  deleteImages,
  fetchImages,
  filterByAlbumId,
  setCurrentPageCount,
  setFiltered,
} from "../../redux/features/imagesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { TImages } from "../../redux/features/models";

const ImageContainer = () => {
  const [perPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    ""
  );
  const [selectedAlbumId, setSelectedAlbumId] = useState<
    number | undefined | string
  >("");

  const { images, currentPage, filteredImages, isFilterByAlbum } =
    useAppSelector(
      ({ data }: RootState) => ({
        images: data.images,
        currentPage: data.currentPage,
        filteredImages: data.filteredImages,
        isFilterByAlbum: data.isFilterByAlbum,
      }),
      shallowEqual
    );

  const slicedImages = isFilterByAlbum
    ? filteredImages
    : images.slice(
        perPage * (currentPage - 1),
        perPage * (currentPage - 1) + 10
      );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<unknown>, page: number) => {
    dispatch(setCurrentPageCount(page));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteImage = (id: number) => {
    dispatch(deleteImages(id));
  };

  const handleOpen = (id: number) => {
    const selectedImageUrl = images?.find((image: TImages) => image.id === id);
    setSelectedImageUrl(selectedImageUrl?.url);
    setOpen(true);
  };

  const filteredAlbumIds = [...new Set(images?.map((i: TImages) => i.albumId))];

  const handleSelectAlbumId = (
    e: SelectChangeEvent<number | string | undefined>
  ) => {
    const albumValue = e?.target.value;
    setSelectedAlbumId(albumValue);
    dispatch(filterByAlbumId(albumValue));
    setCurrentPageCount(1);
    if (albumValue === "All") {
      dispatch(setFiltered(false));
    }
  };

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {slicedImages?.map((image: TImages) => {
        const { thumbnailUrl, title, albumId, id } = image;
        return (
          <ListItem
            key={id}
            sx={{
              padding: "24px",
              marginTop: "20px",
              border: 1,
              borderColor: "grey.500",
              borderRadius: "10px",
            }}
          >
            <Box
              onClick={() => handleOpen(id)}
              sx={{
                cursor: "pointer",
              }}
            >
              <img src={thumbnailUrl} alt="" />
            </Box>
            <ListItemText
              primary={title}
              sx={{
                marginLeft: "20px",
                textTransform: "capitalize",
                fontSize: "18px",
              }}
              secondary={`AlbumId:${albumId}`}
            />

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => handleDeleteImage(id)}
            >
              Delete
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              BackdropProps={{
                sx: {
                  background: "rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  outline: "0",
                }}
              >
                <img src={selectedImageUrl} alt="" />
              </Box>
            </Modal>
          </ListItem>
        );
      })}

      <FormControl
        sx={{
          marginTop: "20px",
          m: 1,
          width: 300,
        }}
      >
        <InputLabel id="demo-simple-select-label">AlbumId</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedAlbumId}
          placeholder="Select album"
          label="Select album"
          onChange={handleSelectAlbumId}
        >
          <MenuItem value="All">All</MenuItem>
          {filteredAlbumIds?.map((albumId: number) => (
            <MenuItem value={albumId}>{albumId}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Pagination
        count={Math.ceil(images?.length / perPage)}
        color="primary"
        onChange={handleChange}
        sx={{
          marginTop: "20px",
        }}
      />
    </List>
  );
};

export default ImageContainer;
