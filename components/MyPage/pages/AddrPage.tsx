import styles from './AddrPage.module.css'
import classNames from 'classnames/bind'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IDeliveryAddr } from '@models/User'
import DaumPostCodeModal from '@components/utils/DaumPostCodeModal/DaumPostCodeModal'
import {
  IUserState,
  userUpdateDeliveryAddrs,
  selectUser,
} from '@redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

const cx = classNames.bind(styles)

const AddrPage = () => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)

  const [deliveryAddrs, setDeliveryAddrs] = useState<IDeliveryAddr[]>([])
  const [open, setOpen] = useState(false)
  const [isAdd, setIsAdd] = useState(false) // 배송지 등록 화면으로 이동할지 여부
  // checkbox
  const [editIndex, setEditIndex] = useState(-1)
  const [isChecked, setIsChecked] = useState<boolean[]>([])
  const [names, setNames] = useState({ picker: '', addressName: '' })
  const [address, setAddress] = useState({ zonecode: '', base: '', extra: '' })
  const [phone, setPhone] = useState({ phone1: '', phone2: '', phone3: '' })
  const [fix, setFix] = useState(false)

  const onChangeCheckbox =
    (selectIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      setIsChecked(
        isChecked.map((check, index) =>
          index === selectIndex ? checked : check
        )
      )
    }

  const handleCheckedAll = () => {
    isChecked.includes(false)
      ? setIsChecked(isChecked.map((_) => true))
      : setIsChecked(isChecked.map((_) => false))
  }

  const onClickShowAdd = () => {
    if (deliveryAddrs.length > 4) {
      return alert('배송지는 최대 5개까지 등록가능합니다.')
    }
    setIsAdd(true)
  }

  const onClickAdd = () => {
    const { picker, addressName } = names
    if (addressName === '') {
      document.getElementById('addressName')?.focus()
      return alert('배송지명을 입력해 주세요.')
    }
    if (picker === '') {
      document.getElementById('picker')?.focus()
      return alert('성명을 입력해 주세요.')
    }
    if (picker.length < 2) {
      return alert('성명은 2글자 이상이어야 합니다.')
    }
    if (address.zonecode === '' || address.zonecode.length !== 5) {
      document.getElementById('zonecode')?.focus()
      return alert('우편번호를 입력해주세요.')
    }
    if (address.base.trim() === '') {
      document.getElementById('base')?.focus()
      return alert('기본주소를 입력해주세요')
    }
    if (address.extra.trim() === '') {
      document.getElementById('extra')?.focus()
      return alert('나머지주소를 입력해주세요')
    }
    if (
      phone.phone1.length < 3 ||
      phone.phone2.length < 3 ||
      phone.phone3.length < 4
    ) {
      return alert('올바른 휴대전화번호를 입력해주세요.')
    }

    const fullAddress = `${
      address.zonecode
    } ${address.base.trim()} ${address.extra.trim()}`
    const fullPhone = `${phone.phone1}-${phone.phone2}-${phone.phone3}`

    const newAddr = {
      fix: deliveryAddrs.length === 0 ? true : fix,
      picker,
      addressName,
      address: fullAddress,
      phone: fullPhone,
    }

    let updateAddrs: IDeliveryAddr[] = []

    if (editIndex === -1) {
      if (fix === false) {
        updateAddrs = [...deliveryAddrs, newAddr]
      } else {
        const newAddrs = deliveryAddrs.map((addr) => {
          return { ...addr, fix: false }
        })

        updateAddrs = [newAddr, ...newAddrs]
      }
    } else {
      if (fix === true || deliveryAddrs[editIndex].fix === true) {
        deliveryAddrs.forEach((addr, index) => {
          updateAddrs.push(
            index !== editIndex
              ? { ...addr, fix: false }
              : { ...newAddr, fix: true }
          )
        })
      } else {
        const newAddrs = deliveryAddrs.filter((_, index) => index !== editIndex)
        updateAddrs = [newAddr, ...newAddrs]
      }
    }

    dispatch(userUpdateDeliveryAddrs(updateAddrs))

    onClickCancelAdd()
  }

  const onClickCancelAdd = () => {
    setIsAdd(false)
    setEditIndex(-1)
    resetFormData()
  }

  const onClickDelete = () => {
    if (!isChecked.includes(true)) {
      return
    }

    const updateDeliveryAddrs = deliveryAddrs.filter(
      (_, index) => !isChecked[index]
    )
    dispatch(userUpdateDeliveryAddrs(updateDeliveryAddrs))
  }

  const onClickEditAddr = (selectIndex: number) => {
    setIsAdd(true)
    setEditIndex(selectIndex)

    const edit = deliveryAddrs[selectIndex]
    setNames({ picker: edit.picker, addressName: edit.addressName })
    const addr = edit.address.slice(5).split(')')
    setAddress({
      zonecode: edit.address.slice(0, 5),
      base: addr[0] + ')',
      extra: addr[1],
    })
    const phones = edit.phone.split('-')
    setPhone({ phone1: phones[0], phone2: phones[1], phone3: phones[2] })
    setFix(edit.fix)
  }

  const onChangeNames = (event: React.ChangeEvent<HTMLInputElement>) => {
    const namesRegex = /[^ㄱ-ㅎ|가-힣|a-z|A-Z|\s]/gi
    const { value, id } = event.target

    if (!namesRegex.test(value) || value.length === 0) {
      setNames({ ...names, [id]: value })
    }
  }

  const onChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = event.target

    if (id === 'zonecode' && !/[\d]/gi.test(value) && value.length !== 0) {
      return
    }
    setAddress({ ...address, [id]: value })
  }

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numRegex = /[\d|]/gi
    const { value, id } = event.target

    if (numRegex.test(value) || value.length === 0) {
      setPhone({ ...phone, [id]: value })
    }
  }

  const handleSubmitAddrSearch = (zonecode: string, base: string) => {
    setAddress({ zonecode, base, extra: '' })
  }

  const resetFormData = () => {
    setNames({ picker: '', addressName: '' })
    setAddress({ zonecode: '', base: '', extra: '' })
    setPhone({ phone1: '', phone2: '', phone3: '' })
    setFix(false)
  }

  useEffect(() => {
    if (user.userData) {
      setDeliveryAddrs(user.userData.deliveryAddrs)
    }
  }, [user.userData?.deliveryAddrs])

  useEffect(() => {
    if (deliveryAddrs.length !== isChecked.length)
      setIsChecked(deliveryAddrs.map((_) => false))
  }, [deliveryAddrs])

  return (
    <>
      <div className={cx('wrapper')}>
        {!isAdd ? (
          <>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className={cx('tableCell', 'checkbox', 'head')}
                      sx={{ width: '13px' }}
                    >
                      <input
                        type="checkbox"
                        name="checkAll"
                        checked={!isChecked.includes(false)}
                        onChange={handleCheckedAll}
                      />
                    </TableCell>
                    <TableCell
                      className={cx('tableCell', 'addressName', 'head')}
                      align="center"
                    >
                      배송지명
                    </TableCell>
                    <TableCell
                      className={cx('tableCell', 'picker', 'head')}
                      align="center"
                    >
                      수령인
                    </TableCell>
                    <TableCell
                      className={cx('tableCell', 'phone', 'head')}
                      align="center"
                    >
                      휴대전화
                    </TableCell>
                    <TableCell
                      className={cx('tableCell', 'address', 'head')}
                      align="center"
                    >
                      <ul>
                        <li className={cx('media')}>
                          <span>{'[ 배송지명'}</span>
                          <span className={cx('block')}></span>
                          <span>{'수령인 ]'}</span>
                        </li>
                        <li>주소</li>
                      </ul>
                    </TableCell>
                    <TableCell
                      className={cx('tableCell', 'edit', 'head')}
                      align="center"
                    >
                      수정
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveryAddrs.map((addr, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={cx('tableCell', 'checkbox')}
                        align="center"
                      >
                        <input
                          type="checkbox"
                          name="checkbox"
                          checked={isChecked[index] ? isChecked[index] : false}
                          onChange={onChangeCheckbox(index)}
                        />
                      </TableCell>
                      <TableCell
                        className={cx('tableCell', 'addressName')}
                        align="center"
                      >
                        <div className={cx('address-addressName')}>
                          {addr.fix && <span className={cx('fix')}>기본</span>}
                          <span>{addr.addressName}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cx('tableCell', 'picker')}
                        align="center"
                      >
                        {addr.picker}
                      </TableCell>
                      <TableCell
                        className={cx('tableCell', 'phone')}
                        align="center"
                      >
                        {addr.phone}
                      </TableCell>
                      <TableCell
                        className={cx('tableCell', 'address')}
                        align="center"
                      >
                        <ul>
                          <li
                            className={cx('media')}
                            style={{ marginBottom: '0.5rem' }}
                          >
                            <div className={cx('address-addressName')}>
                              {addr.fix && (
                                <span className={cx('fix')}>기본</span>
                              )}
                              <span>{addr.addressName}</span>
                            </div>
                            <span className={cx('block')}></span>
                            <span>{addr.picker}</span>
                          </li>
                          <li>{addr.address}</li>
                        </ul>
                      </TableCell>
                      <TableCell
                        className={cx('tableCell', 'edit')}
                        align="center"
                      >
                        <button
                          className={cx('btn', 'changeBtn')}
                          onClick={() => onClickEditAddr(index)}
                        >
                          수정
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={cx('buttons')}>
              <button className={cx('btn', 'listBtn')} onClick={onClickDelete}>
                선택 배송지 삭제
              </button>
              <button className={cx('btn', 'listBtn')} onClick={onClickShowAdd}>
                배송지 등록
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={cx('form')}>
              <div className={cx('inputBox')}>
                <span className={cx('label')}>
                  배송지명 <span>*</span>
                </span>
                <input
                  className={cx('input')}
                  type="text"
                  id="addressName"
                  name="addressName"
                  value={names.addressName}
                  onChange={onChangeNames}
                />
              </div>
              <div className={cx('inputBox')}>
                <span className={cx('label')}>
                  성명 <span>*</span>
                </span>
                <input
                  className={cx('input')}
                  type="text"
                  id="picker"
                  name="picker"
                  value={names.picker}
                  onChange={onChangeNames}
                />
              </div>
              <div className={cx('inputBox')}>
                <span className={cx('label')}>
                  주소 <span>*</span>
                </span>
                <ul className={cx('inputs-addr')}>
                  <li>
                    <input
                      className={cx('input', 'input-zonecode')}
                      type="text"
                      id="zonecode"
                      name="address"
                      maxLength={5}
                      value={address.zonecode}
                      onChange={onChangeAddress}
                    />
                    <button className={cx('btn')} onClick={() => setOpen(true)}>
                      우편번호
                    </button>
                  </li>
                  <li>
                    <input
                      className={cx('input', 'input-address')}
                      type="text"
                      id="base"
                      name="address"
                      value={address.base}
                      onChange={onChangeAddress}
                    />
                    <span>기본주소</span>
                  </li>
                  <li>
                    <input
                      className={cx('input', 'input-address')}
                      type="text"
                      id="extra"
                      name="address"
                      value={address.extra}
                      onChange={onChangeAddress}
                    />
                    <span>나머지주소</span>
                  </li>
                </ul>
              </div>
              <div className={cx('inputBox')}>
                <span className={cx('label')}>
                  휴대전화 <span>*</span>
                </span>
                <div className={cx('inputs-phone')}>
                  <input
                    className={cx('input')}
                    type="text"
                    id="phone1"
                    name="phone"
                    maxLength={3}
                    value={phone.phone1}
                    onChange={onChangePhone}
                  />
                  <span>-</span>
                  <input
                    className={cx('input')}
                    type="text"
                    id="phone2"
                    name="phone"
                    maxLength={4}
                    value={phone.phone2}
                    onChange={onChangePhone}
                  />
                  <span>-</span>
                  <input
                    className={cx('input')}
                    type="text"
                    id="phone3"
                    name="phone"
                    maxLength={4}
                    value={phone.phone3}
                    onChange={onChangePhone}
                  />
                </div>
              </div>
              <div className={cx('inputBox', 'check-inputBox')}>
                <input
                  id="fix"
                  type="checkbox"
                  checked={fix}
                  onChange={(event) => setFix(event.target.checked)}
                />
                <label htmlFor="fix">기본 배송지로 지정</label>
              </div>
            </div>

            <div className={cx('add-buttons')}>
              <button
                className={cx('btn', 'add-listBtn', 'blackBtn')}
                onClick={onClickAdd}
              >
                등록
              </button>
              <button
                className={cx('btn', 'add-listBtn')}
                onClick={onClickCancelAdd}
              >
                취소
              </button>
            </div>
          </>
        )}
        <div className={cx('desc')}>
          <ul>
            <li>
              <span className={cx('desc-num')}>1</span>
              <span>
                배송 주소록은 최대 5개까지 등록할 수 있으며, 별도로 등록하지
                않을 경우 최근 배송 주소록 기준으로 자동 업데이트 됩니다.
              </span>
            </li>
            <li>
              <span className={cx('desc-num')}>2</span>
              <span>
                기본 배송지는 1개만 저장됩니다. 다른 배송지를 기본 배송지로
                설정하시면 기본 배송지가 변경됩니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
      <DaumPostCodeModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmitAddrSearch}
      />
    </>
  )
}

export default AddrPage
