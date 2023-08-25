
function _gen(bytes, bFn, WordLen, swapType) {
    return {
        bytes,
        parser: (buffer, offset = 0) => { 
            _swap(buffer, swapType, offset);
            return buffer['read' + bFn](offset) 
        },
        formatter: v => {
            var b = Buffer.allocUnsafe(bytes);//new Buffer(bytes);
            b['write' + bFn](v);
            _swap(b, swapType);
            return b;
        },
        WordLen
    }
}

function _swap(buffer, swapType, offset = 0) {
    if (swapType == 2) {
        var temp = buffer[offset + 0];
        buffer[offset + 0] = buffer[offset + 2]; buffer[offset + 2] = temp;
        temp = buffer[offset + 1]; 
        buffer[offset + 1] = buffer[offset + 3];buffer[offset + 3] = temp;
    }
}

const Datatypes = {
    /**
     * Bool
     */
    Bool: {
        bytes: 1,
        // parser: (v, bit = 0) => v >> bit & 1 === 1,
        parser: (buffer, offset = 0, bit = 0) => +buffer.readUInt8(offset) >> bit & 1 === 1,
        formatter: v => (v === '1' || v === 1 || v === true) ? 1 : 0,
        WordLen: 1
    },
    /**
     * Int16
     */
    Int16: _gen(2, 'Int16BE', 1),
    /**
     * UInt16
     */
    UInt16: _gen(2, 'UInt16BE', 1),
    /**
     * Int32
     */
    Int32: _gen(4, 'Int32BE', 2),
    /**
     * UInt32
     */
    UInt32: _gen(4, 'UInt32BE', 2),
    /**
     * Float32
     */
    Float32: _gen(4, 'FloatBE', 2),
    /**
     * Float64
     */
    Float64: _gen(8, 'DoubleBE', 4),
    
    /**
     * Int16LE
     */
    Int16LE: _gen(2, 'Int16LE', 1),
    /**
     * UInt16LE
     */
    UInt16LE: _gen(2, 'UInt16LE', 1),
    /**
     * Int32LE
     */
    Int32LE: _gen(4, 'Int32LE', 2),
    /**
     * UInt32LE
     */
    UInt32LE: _gen(4, 'UInt32LE', 2),
    /**
     * Float32LE
     */
    Float32LE: _gen(4, 'FloatLE', 2),
    /**
     * Float64LE
     */
    Float64LE: _gen(8, 'DoubleLE', 4),
    
    /**
     * Int32MLE
     */
    Int32MLE: _gen(4, 'Int32BE', 2, 2),
    /**
     * UInt32MLE
     */
    UInt32MLE: _gen(4, 'UInt32BE', 2, 2),
    /**
     * Float32MLE
     */
    Float32MLE: _gen(4, 'FloatBE', 2, 2),

    /**
     * String
     */
    ASCII: {
        bytes: 6,
        parser: (buffer, offset = 0) => {
        
          const temp1 = buffer[offset + 0];
          buffer[offset + 0] = buffer[offset + 1];
          buffer[offset + 1] = temp1;

          const temp2 = buffer[offset + 2];
          buffer[offset + 2] = buffer[offset + 3];
          buffer[offset + 3] = temp2;

          const temp3 = buffer[offset + 4];
          buffer[offset + 4] = buffer[offset +5 ];
          buffer[offset + 5] = temp3;

          return buffer.toString('ascii', offset, offset + 6);
        },

        formatter: v => {
          const b = Buffer.allocUnsafe(6);
          b.write(v, 'ascii');

          const temp1 = b[0];
          b[0] = b[1];
          b[1] = temp1;

          const temp2 = b[2];
          b[2] = b[3];
          b[3] = temp2;

          const temp3 = b[4];
          b[4] = b[5];
          b[5] = temp3;

          return b;
        },
        WordLen: 1,
      }
};

module.exports = Datatypes;
