import struct
import numpy as np


def read_bmp(path):
    with open(path, "rb") as f:
        data = f.read()
    assert data[:2] == b"BM"
    offset = struct.unpack_from("<I", data, 10)[0]
    width = struct.unpack_from("<i", data, 18)[0]
    height = struct.unpack_from("<i", data, 22)[0]
    bpp = struct.unpack_from("<H", data, 28)[0]
    assert bpp == 24, bpp
    top_down = height < 0
    height = abs(height)
    row_size = (width * 3 + 3) // 4 * 4
    arr = np.frombuffer(data, dtype=np.uint8, count=row_size * height, offset=offset)
    arr = arr.reshape(height, row_size)[:, : width * 3].reshape(height, width, 3)
    if not top_down:
        arr = arr[::-1]
    # BMP stores BGR
    return arr[:, :, ::-1].copy()


def dark_mask(rgb, threshold=128):
    return rgb.mean(axis=2) < threshold
